# == Schema Information
#
# Table name: nodes
#
#  id         :bigint           not null, primary key
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  photo_id   :bigint
#  node_id    :bigint
#  content    :string
#  price      :integer
#  type       :string
#  position   :integer
#

class Category < Node

  has_many :leaves, -> { order(position: :asc) }, foreign_key: :node_id
  has_many :category_translations, foreign_key: 'node_id', class_name: 'NodeTranslation'

  belongs_to :level, foreign_key: :node_id
  #level is node
  acts_as_list scope: :node

end
