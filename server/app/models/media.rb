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

  validates :name, presence: true, uniqueness: { case_sensitive: false }
  validates :price, presence: true

  has_many :media_licences
  has_many :media_translations, foreign_key: 'media_id', class_name: 'MediaTranslation'

  acts_as_list

  translates :name, :author, :content, :place

  class << self

    def upload_and_create(params)
      media = Media.create!(name: params[:name], author: params[:author], price: params[:price], duration: params[:duration], place: params[:place], content: params[:content])
      media_id_original = JWPlayer::MediaUpload.create_and_upload(params[:name], nil, params[:file])
      media_id_trim = JWPlayer::MediaUpload.create_and_upload(params[:name], '00:00:10.000', params[:file])
      media.update!(jwplayer_media_id: media_id_original, jwplayer_media_preview_id: media_id_trim)
      media
    end

  end

  def video(media_id)
    video_url = JWPlayer::Video.url(media_id)
    update!(file_not_found: true) if video_url.nil?
    update!(file_not_found: false) if video_url.present?
    video_url
  end

  def photo(media_id)
    photo_url = JWPlayer::Photo.url(media_id)
    update!(file_not_found: true) if photo_url.nil?
    update!(file_not_found: false) if photo_url.present?
    photo_url
  end

end
