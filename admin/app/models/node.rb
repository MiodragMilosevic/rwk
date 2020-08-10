class Node < ApplicationRecord
  include MultiLanguage

  establish_connection SEC_DATABASE

  belongs_to :photo, optional: true
  accepts_nested_attributes_for :photo
  validates :name, presence: true


  belongs_to :node, optional: true

  has_many :nodes, dependent: :destroy
  has_many :leaves, dependent: :destroy
  has_many :licences, dependent: :destroy

  has_many :node_translations, foreign_key: 'node_id', class_name: 'NodeTranslation'

  scope :filter_by_name, -> (name) { where(name: name)}

  translates :name, :content

  def parsed_content
    if content.present?
      JSON.parse(content.to_json)
    else
      {}
    end
  end

end