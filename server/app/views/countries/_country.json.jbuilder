json.id country.id
json.name country.name
json.main_representative do
  json.name country.mr_name
  json.address country.mr_address
  json.phone country.mr_phone
  json.email country.mr_email
end
json.centres do
  json.array! country.centres, partial: 'centres/center', as: :center
end
