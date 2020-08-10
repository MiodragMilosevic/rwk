module JWPlayer
  class Video < Media

    def self.url(media_id)
      playlist = playlist(media_id)
      if playlist.present? && playlist.length > 0
        source = playlist[0]['sources']
        if source.present? && source.length > 0
          source[source.length - 1]['file']
        else
          nil
        end
      else
        nil
      end
    rescue RestClient::NotFound
      nil
    end
  end
end
