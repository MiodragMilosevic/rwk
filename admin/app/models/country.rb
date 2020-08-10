# == Schema Information
#
# Table name: countries
#
#  id         :bigint           not null, primary key
#  name       :string
#  mr_name    :string
#  mr_address :string
#  mr_phone   :string
#  mr_email   :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Country < ApplicationRecord
  establish_connection SEC_DATABASE
  has_many :centres, dependent: :destroy

  validates :name, presence: true

  scope :filter_by_name, -> (name) { where(name: name)}
end
