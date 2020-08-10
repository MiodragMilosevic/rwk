json.id node_licence.id
json.activation_code node_licence.activation_code
json.status node_licence.status
json.start_date node_licence.start_date
json.end_date node_licence.end_date

json.instrument do
  json.partial! "instruments/instrument", instrument: node_licence.instrument
end

json.level do
  json.partial! "levels/level", level: node_licence.level
end
