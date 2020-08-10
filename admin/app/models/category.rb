class Category < Node

  has_many :leaves, -> { order(position: :asc) }, foreign_key: :node_id
  belongs_to :level, foreign_key: :node_id
  #level is node

  has_many :category_translations, foreign_key: 'node_id', class_name: 'NodeTranslation', dependent: :destroy
  accepts_nested_attributes_for :category_translations, allow_destroy: true
  acts_as_list scope: :node


end
