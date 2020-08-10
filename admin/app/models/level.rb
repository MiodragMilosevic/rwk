class Level < Node

  belongs_to :instrument, foreign_key: :node_id
  has_many :categories,  -> { order(position: :asc) }, foreign_key: :node_id
  acts_as_list scope: :node


  validates :name, presence: :true, numericality: { only_integer: true }
  validates :price, presence: :true


  validate :level_price
  validate :validate_json

  has_many :level_translations, foreign_key: 'node_id', class_name: 'NodeTranslation', dependent: :destroy
  accepts_nested_attributes_for :level_translations, allow_destroy: true

  private

  def level_price
    if (self.price)
      if self.price <= 0
        errors.add(:base, "Inccorect value for price")
      end
    end
  end

  def validate_json
    JSON.parse(self.content)

  rescue JSON::ParserError
    errors.add(:base, "Content is not json")
  end

end