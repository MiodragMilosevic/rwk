ActiveAdmin.register Organization do
  permit_params :name

  index do
    selectable_column
    id_column
    column :name
    actions
  end

  show do
    attributes_table do
      row :id
      row :name
      row :created_at
      row :updated_at
    end
  end

  filter :name
  filter :created_at
  filter :updated_at

end