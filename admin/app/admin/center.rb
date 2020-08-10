ActiveAdmin.register Center do

  permit_params :name, :director, :address, :email, :website, :phone,
                :country, :country_id,
                country_attributes: [:id, :name, :mr_name, :mr_address, :mr_phone, :mr_email]

  index do
    column :name
    column :director
    column :address
    column :email
    column :phone
    actions
  end

  show do
    attributes_table do
      row :name
      row :director
      row :address
      row :email
      row :phone
      row 'Website' do |center|
        link_to center.website, center.website
      end
      row 'Country Name' do |center|
        center.country.name
      end
      row :created_at
      row :updated_at
    end
  end

  form  do |f|
    f.inputs 'Center' do
      f.input :name
      f.input :director
      f.input :address
      f.input :email
      f.input :phone
      f.input :website
      f.input :country, as: :select, collection: Country.all
    end
    f.actions
  end

  filter :name
  filter :director
  filter :address
  filter :phone
  filter :email
  filter :created_at
  filter :updated_at
end
