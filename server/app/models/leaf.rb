# == Schema Information
#
# Table name: leaves
#
#  id          :bigint           not null, primary key
#  pdf         :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  content     :string
#  node_id     :bigint
#  pdf_preview :string
#  name        :string
#  position    :integer
#

class Leaf < ApplicationRecord
  include MultiLanguage

  mount_uploader :pdf, DocumentUploader
  mount_uploader :pdf_preview, DocumentUploader

  belongs_to :category, foreign_key: :node_id, class_name: 'Category'

  scope :filter_by_category, ->(category_id) { where(node_id: category_id) }

  validates :name, presence: true

  has_many :leaf_translations, foreign_key: 'leaf_id', class_name: 'LeafTranslation'

  acts_as_list scope: :node

  translates :name, :content

  def parsed_content
    if content.present?
      JSON.parse(content)
    else
      {}
    end
  end

end
