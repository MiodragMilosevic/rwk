json.id media.id
json.name media.name
json.author media.author
json.content media.content
json.price media.price
json.duration media.duration
json.place media.place
json.file_not_found media.file_not_found
json.jwplayer_original do
  json.media_id media.jwplayer_media_id
  json.video media.video(media.jwplayer_media_id) if current_user.present? && current_user.has_media?(media)
  json.photo media.photo(media.jwplayer_media_id)
end
json.jwplayer_preview do
  json.media_id media.jwplayer_media_preview_id
  json.video media.video(media.jwplayer_media_preview_id)
  json.photo media.photo(media.jwplayer_media_preview_id)
end

