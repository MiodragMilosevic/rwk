 module JWPlayer
  class Photo < Media

    def self.url(media_id)
      playlist = playlist(media_id)
      if playlist.present? && playlist.length > 0
        playlist[0]['image']
      else
        nil
      end
    rescue RestClient::NotFound
      nil
    end
  end
end
