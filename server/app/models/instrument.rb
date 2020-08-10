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

class Instrument < Node

  validates :name, presence: :true, uniqueness: { case_sensitive: false }

  has_many :levels,  -> { order(position: :asc) }, foreign_key: :node_id
  has_many :instrument_translations, foreign_key: 'node_id', class_name: 'NodeTranslation'
  acts_as_list

  def original_name
    self[:name]
  end


end
