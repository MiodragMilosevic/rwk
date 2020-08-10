# == Schema Information
#
# Table name: users
#
#  id              :bigint(8)        not null, primary key
#  first_name      :string           not null
#  last_name       :string           not null
#  email_address   :string
#  username        :string
#  password_digest :string
#  email_confirmed :boolean          default(FALSE)
#  facebook_id     :string
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  photo_id        :bigint(8)
#  telephone       :string
#  date_of_birth   :date
#  stripe_id       :string(50)
#

class User < ApplicationRecord
  establish_connection SEC_DATABASE

  belongs_to :photo, optional: true
  accepts_nested_attributes_for :photo
  has_many :user_roles, dependent: :destroy
  accepts_nested_attributes_for :user_roles, allow_destroy: true

  has_many :user_licences, foreign_key: 'user_id', class_name: 'Licence', dependent: :destroy
  has_many :owner_licences, foreign_key: 'owner_id', class_name: 'Licence', dependent: :destroy
  has_many :media_licences, foreign_key: 'media_id', class_name: 'MediaLicence'

  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :email_address, uniqueness: { case_sensitive: false }, allow_blank: true
  validates :username, uniqueness: { case_sensitive: false }, allow_blank: true
  validates :facebook_id, uniqueness: { case_sensitive: false }, allow_blank: true

  validate do
    if facebook_id.blank? && (username.blank? || email_address.blank?)
      errors.add(:base, "You need to use at least one provider! Username or facebook_id is missing.")
    end
  end

  has_secure_password


  class << self
    def from_provider(params)
      provider = AuthProviderBuilder.build(params)
      provider.to_user
    end

    def create_with_mail(params)
      user = User.create!(params)
      user.send_verification_email
      user
    end

  end

  def create_customer(customer_params)
    raise StripeTokenNotSendError if customer_params[:stripe_token].nil?
    customer = Stripe::Customer.create({ email: email_address, source: customer_params[:stripe_token] })
    update!(stripe_id: customer.id)
  end

  def auth_token(expiration = 24.hours)
    user_roles = []
    UserRole.where(user: self).each do |user_role|
      user_roles << {role: user_role.role, organization_id: user_role.organization_id}
    end
    token_payload = { user_id: id, user_roles: user_roles, exp: Time.now.to_i + expiration }
    JWT.encode(token_payload, Rails.application.credentials.secret_key_base, 'HS256')
  end

  def confirm_token(expiration = 15.minutes)
    generate_token(expiration)
  end

  def password_token(expiration = 1.hour)
    token = generate_token(expiration)
    UserMailer.forgot_password(self, token).deliver_later
    token
  end

  def confirm_account
    update!(email_confirmed: true)
  end

  def accessible?(leaf)
    user_licences.where(status: :approved, level: leaf.category.level)
        .where("start_date <= ? and end_date > ?", Date.today, Date.today)
        .exists?
  end

  def send_verification_email
    @token = confirm_token
    UserMailer.verification(self, @token).deliver_later
  end

  private

  def set_disclaimer
    self.disclaimer = false
  end

  def generate_token(expiration)
    token_payload = { user_id: id, exp: Time.now.to_i + expiration }
    JWT.encode(token_payload, Rails.application.credentials.secret_key_base, 'HS256')
  end

end
