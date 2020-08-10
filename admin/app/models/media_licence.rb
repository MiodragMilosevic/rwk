class MediaLicence < Licence

  belongs_to :media, optional: true, class_name: 'Media'
  accepts_nested_attributes_for :media
  validates :user_id, presence: true

  before_create :check_licence

  private


  def check_licence
    raise UserAlreadyLicencedError if user.media_licences.where(status: :approved).or(user.media_licences.where(status: :pending)).where(media: media).present?
  end
end
