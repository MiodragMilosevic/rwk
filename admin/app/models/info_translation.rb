class InfoTranslation < Translation
  belongs_to :info

  validate :validate_json
  validate :already_exist, on: :create

  private

  def validate_json
    JSON.parse(self.value)
  rescue JSON::ParserError
    errors.add(:base, "Content is not json")
  end

  def already_exist
    translations = Translation.find_by(locale: self.locale, key: self.key, info_id: self.info_id)
    unless translations.nil?
      errors.add(:base, "This translate already exist")
   end
  end
end
