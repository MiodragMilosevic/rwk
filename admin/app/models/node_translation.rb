class NodeTranslation < Translation
  validates :node_id, presence: true

  belongs_to :node

  validate :validate_json
  validate :already_exist, on: :create

  private

  def validate_json
    if self.key != 'content'
      return
    end
    JSON.parse(self.value)
      rescue JSON::ParserError
      errors.add(:base, "Content is not json")
  end

  def already_exist
    translations = Translation.find_by(locale: self.locale, key: self.key, node_id: self.node_id)
    unless translations.nil?
      errors.add(:base, "This translate already exist")
    end
  end

end
