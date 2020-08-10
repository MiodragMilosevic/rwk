json.array! @categories, partial: 'categories/category', as: :category, locals: {current_user: @current_user}
