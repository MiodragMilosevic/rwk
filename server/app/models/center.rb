class Center < ApplicationRecord
  belongs_to :country

  validates :name, presence: true
end
