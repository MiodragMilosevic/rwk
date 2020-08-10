module JWPlayer
  class MediaUpload
    ESCAPE_REGEX = /[^a-z0-9\-\.\_\~]/i

    def self.create_and_upload(title, trim_out_point, file)
      data = {
        title: title,
        sourcetype: :file,
        upload_method: :single
      }
      data[:trim_out_point] = trim_out_point if trim_out_point.present?
      file.open
      url = create_url(data)
      response = RestClient.post(url.to_s, {}, {content_type: 'application/x-www-form-urlencoded', accept: :json})
      json = JSON.parse(response.body)
      media_id = json['media']['key']
      protocol = json['link']['protocol']
      address = json['link']['address']
      path = json['link']['path']
      key = json['link']['query']['key']
      token = json['link']['query']['token']
      upload_url = "#{protocol}://#{address}#{path}?api_format=xml&key=#{key}&token=#{token}"
      RestClient.post(upload_url, file: file, content_type: 'application/x-www-form-urlencoded', accept: 'application/json')
      file.close
      media_id
    end

    private

    def self.create_url (data)
      options = {
        host:    'api.jwplatform.com',
        scheme:  'https',
        version: :v1,
        key:     Rails.application.config.jwplayer_key,
        secret:  Rails.application.config.jwplayer_secret,
        format:  :json,
        nonce: rand.to_s[2..9],
        timestamp: Time.now.to_i.to_s
      }
      uri = URI.join(URI::Generic.build(options), [options[:version], '/'].join, 'videos/create')
      uri.query = signature_params(data, options)
      uri.normalize!
      uri
    end

    def self.signature_params(data, options)
      api_params = {
        api_format: :json,
        api_key: Rails.application.config.jwplayer_key,
        api_nonce: options[:nonce],
        api_timestamp: options[:timestamp]
      }
      params = api_params.to_a + data.to_a

      #Parameter sorting
      params = params.sort

      #Concatenating parameters
      query = params.map { |key, value| [key, URI.escape(value.to_s, ESCAPE_REGEX)].join('=') }.join('&')

      #Adding secret
      token = "#{query}#{options[:secret]}"

      #Creating signature
      signature = Digest::SHA1.hexdigest(token)
      "#{query}&api_signature=#{signature}"
    end
  end
end
