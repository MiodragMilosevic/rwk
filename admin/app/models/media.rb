# == Schema Information
#
# Table name: medias
#
#  id                        :bigint           not null, primary key
#  name                      :string
#  author                    :string
#  content                   :string
#  price                     :integer
#  duration                  :string
#  place                     :string
#  jwplayer_media_id         :string
#  jwplayer_media_preview_id :string
#  created_at                :datetime         not null
#  updated_at                :datetime         not null
#  position                  :integer
#  file_not_found            :boolean          default(FALSE)
#

require 'jwplayer/media_upload'
require 'jwplayer/media'
require 'jwplayer/photo'
require 'jwplayer/video'

class Media < ApplicationRecord
  include MultiLanguage
  establish_connection SEC_DATABASE


  validates :name, presence: true, uniqueness: { case_sensitive: false }
  validates :price, presence: true

  has_many :media_licences, dependent: :destroy
  has_many :media_translations, foreign_key: 'media_id', class_name: 'MediaTranslation', dependent: :destroy
  accepts_nested_attributes_for :media_translations, allow_destroy: true

  acts_as_list

  translates :name, :author, :content, :place

  validate :price_cost

  def video(media_id)
    video_url = JWPlayer::Video.url(media_id)
    update!(file_not_found: true) if video_url.nil?
    video_url
  end

  def photo(media_id)
    photo_url = JWPlayer::Photo.url(media_id)
    update!(file_not_found: true) if photo_url.nil?
    photo_url
  end

  private

  def price_cost
    if (self.price)
      if self.price <= 0
        errors.add(:base, "Inccorect value for price")
      end
    end
  end

end
