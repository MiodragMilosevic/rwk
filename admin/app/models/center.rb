class Center < ApplicationRecord
  establish_connection SEC_DATABASE
  belongs_to :country

  validates :name, presence: true
end
