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


class Node < ApplicationRecord
  include MultiLanguage

  validates :name, presence: true

  belongs_to :photo, optional: true
  belongs_to :node, optional: true

  has_many :node_translations, foreign_key: 'node_id', class_name: 'NodeTranslation'
  has_many :nodes
  has_many :leaves
  has_many :licences

  translates :name, :content


  scope :filter_by_name, -> (name) { where(name: name)}


  def parsed_content
    if content.present?
      JSON.parse(content)
    else
      {}
    end
  end

end
