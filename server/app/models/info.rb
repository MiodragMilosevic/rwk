# == Schema Information
#
# Table name: infos
#
#  id         :bigint           not null, primary key
#  name       :string
#  content    :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Info < ApplicationRecord
  include MultiLanguage

  validates :name, presence: true, uniqueness: { case_sensitive: false }
  scope :filter_by_name, -> (name) { where(name: name)}
  has_many :info_translations, foreign_key: 'info_id', class_name: 'InfoTranslation'

  translates :content

  class << self
    def filter(params)
      where(name: params[:name])
    end
  end

  def parsed_content
    if content.present?
      JSON.parse(content)
    else
      {}
    end
  end
end
