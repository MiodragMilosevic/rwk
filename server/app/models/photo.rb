# == Schema Information
#
# Table name: photos
#
#  id         :bigint           not null, primary key
#  image      :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Photo < ApplicationRecord
  mount_uploader :image, ImageUploader

  validates :image, presence: true
end
