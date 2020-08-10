module JWPlayer
  class Media

    def self.playlist (media_id)
      exp = Time.now.to_i + 24.hours
      token = { resource: "/v2/media/#{media_id}", exp: exp.to_i}
      encoded = JWT.encode(token, Rails.application.config.jwplayer_secret, 'HS256', {alg: 'HS256', typ: 'JWT'})
      url = "#{Rails.application.config.jwplayer_host}/v2/media/#{media_id}?token=#{encoded}"
      response = RestClient.get(url, content_type: 'application/json', accept: 'application/json')
      response = JSON.parse response.body
      response['playlist']
    end
  end
end
