class MediaTranslation < Translation
  validates :media_id, presence: true

  belongs_to :media
end
