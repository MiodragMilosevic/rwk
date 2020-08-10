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

class MediaLicence < Licence

  belongs_to :media

  validates :user_id, presence: true

  after_create :charge_licence
  before_create :check_licence

  private

  def charge_licence
    user = User.find(user_id)
    raise UserNoCustomerError if user.stripe_id.nil?
    charge = Stripe::Charge.create({ customer: user.stripe_id, amount: media.price * 100, description: 'Rails Stripe customer', currency: 'usd' })
    update!(charge_id: charge.id)
  end

  def check_licence
    raise UserAlreadyLicencedError if user.media_licences.where(status: :approved).or(user.media_licences.where(status: :pending)).where(media: media).present?
  end
end
