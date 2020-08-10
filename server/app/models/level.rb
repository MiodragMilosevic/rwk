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

class Level < Node

  belongs_to :instrument, foreign_key: :node_id
  has_many :categories,  -> { order(position: :asc) }, foreign_key: :node_id
  has_many :level_translations, foreign_key: 'node_id', class_name: 'NodeTranslation'

  acts_as_list scope: :node


  validates :name, presence: :true
  validates :price, presence: :true

  scope :filter_by_instrument, -> (instrument_id) { where(node_id: instrument_id)}


end
