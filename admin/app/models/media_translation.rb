class MediaTranslation < Translation
  validates :media_id, presence: true

  belongs_to :media

  validate :already_exist, on: :create

  def already_exist
    translations = Translation.find_by(locale: self.locale, key: self.key, media_id: self.media_id)
    unless translations.nil?
      errors.add(:base, "This translate already exist")
    end
  end
end
