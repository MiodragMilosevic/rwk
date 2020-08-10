ActiveAdmin.register Photo do

  actions :all

  permit_params :image

  show do
    attributes_table do
      row :image do |photo|
        image_tag(photo.image.url)
      end
      row :created_at
      row :updated_at
    end
  end

  index do
    selectable_column
    id_column
    column :image do |photo|
      image_tag(photo.image.url, :size => "100x100")
    end
    actions
  end

  filter :created_at
  filter :updated_at

end