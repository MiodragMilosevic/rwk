# == Schema Information
#
# Table name: licences
#
#  id              :bigint           not null, primary key
#  activation_code :string
#  start_date      :date
#  end_date        :date
#  status          :integer          default("pending")
#  owner_id        :bigint
#  user_id         :bigint
#  node_id         :bigint
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  charge_id       :string(50)
#  type            :string
#  media_id        :bigint
#

class NodeLicence < Licence
  before_create :set_activation_code
  after_create :charge_licence


  scope :filter_by_status, ->(status) { where(status: status) }
  scope :filter_by_user, ->(user) { where(user: user) }

  belongs_to :level, foreign_key: :node_id, class_name: 'Level'
  belongs_to :organization, optional: true
  belongs_to :owner, class_name: 'User', optional: true

  validates :activation_code, uniqueness: {case_sensitive: false}


  def activate(user)
    raise LicenceUnavailableError if self.user_id.present?
    raise UserAlreadyLicencedError if user.user_licences.where(status: :approved).or(user.user_licences.where(status: :pending)).where(level: self.level).where("end_date >= ?", Date.today.to_date).present?
    update!(user_id: user.id, start_date: Date.today, end_date: Date.today.next_year)
  end

  def instrument
    level.instrument
  end

  private

  def set_activation_code
    self.activation_code = SecureRandom.uuid
  end

  def charge_licence
    owner = User.find(owner_id)
    raise UserNoCustomerError if owner.stripe_id.nil?
    charge = Stripe::Charge.create({ customer: owner.stripe_id, amount: level.price * 100, description: 'Rails Stripe customer', currency: 'usd' })
    update!(charge_id: charge.id)
  end
end
