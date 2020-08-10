class Instrument < Node

  validates :name, presence: :true, uniqueness: { case_sensitive: false }
  validate :validate_json


  has_many :instrument_translations, foreign_key: 'node_id', class_name: 'NodeTranslation', dependent: :destroy
  accepts_nested_attributes_for :instrument_translations, allow_destroy: true

  has_many :levels,  -> { order(position: :asc) }, foreign_key: :node_id
  acts_as_list scope: :node

  translates :name, :content

  private

  def validate_json
    JSON.parse(self.content)

  rescue JSON::ParserError
    errors.add(:base, "Content is not json")
  end


end
