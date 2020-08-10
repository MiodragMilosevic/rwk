json.id instrument.id
json.name instrument.name
json.position instrument.position
json.original_name instrument.original_name
json.photo do
  json.partial! "photos/photo", photo: instrument.photo
end if instrument.photo.present?
json.content instrument.parsed_content

