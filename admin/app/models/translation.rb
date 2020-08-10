# == Schema Information
#
# Table name: translations
#
#  id         :bigint           not null, primary key
#  locale     :string           not null
#  key        :string           not null
#  value      :string
#  type       :string
#  node_id    :bigint
#  page_id    :bigint
#  leaf_id    :bigint
#  media_id   :bigint
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Translation < ApplicationRecord
  establish_connection SEC_DATABASE
  enum locale: [:zh, :en, :es]

  validates :locale, presence: true
end
