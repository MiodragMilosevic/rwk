class Info < ApplicationRecord
  establish_connection SEC_DATABASE
  include MultiLanguage

  validates :name, presence: true, uniqueness: { case_sensitive: false }
  scope :filter_by_name, -> (name) { where(name: name)}
  validate :validate_json


  has_many :info_translations, foreign_key: 'info_id', class_name: 'InfoTranslation', dependent: :destroy
  accepts_nested_attributes_for :info_translations, allow_destroy: true
  translates :content

  def parsed_content
    if content.present?
      JSON.parse(content.to_json)
    else
      {}
    end
  end

  private

  def validate_json
      JSON.parse(self.content)
      rescue JSON::ParserError
        errors.add(:base, "Content is not json")
  end

end