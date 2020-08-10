class Photo < ApplicationRecord
  establish_connection SEC_DATABASE

  mount_uploader :image, ImageUploader
  has_many :users, dependent: :nullify
  #validates :image, presence: true

end