ActiveAdmin.register Country do

  permit_params :name, :mr_name, :mr_address, :mr_phone, :mr_email

  index do
    column :name
    column 'Main representative name' do |country|
      country.mr_name
    end
    column 'Main representative address' do |country|
      country.mr_address
    end
    column 'Main representative phone' do |country|
      country.mr_phone
    end
    column 'Main representative email' do |country|
      country.mr_email
    end
    actions
  end

  show do
    attributes_table do
      row :name
      row 'Main representative name' do |country|
        country.mr_name
      end
      row 'Main representative address' do |country|
        country.mr_address
      end
      row 'Main representative address' do |country|
        country.mr_phone
      end
      row 'Main representative address' do |country|
        country.mr_email
      end
      row :created_at
      row :updated_at
    end
  end

  form  do |f|
    f.inputs 'Country' do
      f.input :name
      f.input :mr_name, label: 'Main representative name'
      f.input :mr_address, label: 'Main representative address'
      f.input :mr_phone, label: 'Main representative phone'
      f.input :mr_email, label: 'Main representative email'
    end
    f.actions
  end

  filter :name
  filter :mr_name
  filter :mr_address
  filter :mr_phone
  filter :mr_email
  filter :created_at
  filter :updated_at

end
