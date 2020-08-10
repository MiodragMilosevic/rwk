class InfoTranslation < Translation
  validates :info_id, presence: true

  belongs_to :info
end
