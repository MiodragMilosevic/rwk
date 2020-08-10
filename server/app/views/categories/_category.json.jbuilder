json.id category.id
json.name category.name
json.position category.position
json.leaves do
  json.array! category.leaves, partial: 'leaves/leaf', as: :leaf, locals: {current_user: current_user}
end
