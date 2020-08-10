ActiveAdmin.register User do

  actions :all, :except => [:new]

  permit_params :id, :first_name, :last_name, :username, :photo, :photo_id, :email_address, :telephone, :date_of_birth, :address,
                photo_attributes: [:id, :image], user_role_ids: [],
                user_roles_attributes: [:id, :role, :role_id, :organization, :organization_id, :user_id]


  # media_translation_ids: [],
  #     media_translations_attributes: [:id, :locale, :key, :value, :type, :node_id, :page_id, :leaf_id, :media_id]

  show do
    attributes_table do
      row :first_name
      row :last_name
      row :username
      row :telephone
      row :date_of_birth
      row :address
      row :email_address
      row :photo do |user|
        image_tag(user.photo.image.url, :size => "100x100") unless user.photo.nil?
      end
      row :created_at
      row :updated_at
    end
    if user.user_roles
      panel "UserRole" do
        table_for user.user_roles do
          column 'Role' do |user_role|
            user_role.role
          end
          column 'Organization' do |user_role|
            if user_role.organization
              user_role.organization.name unless user_role.organization.name.nil?
            end
          end
        end
      end
    end
  end

  index do

    selectable_column
    column :first_name
    column :last_name
    column :username
    column :photo do |user|
      image_tag(user.photo.image.url, :size => "100x100") unless user.photo.nil?
    end
    actions
  end

  form  do |f|
    f.inputs 'Instrument' do
      f.input :first_name
      f.input :last_name
      f.input :username
      f.input :email_address
      f.input :telephone
      f.input :date_of_birth
      f.input :address
    end
    f.inputs 'Photo', for: [:photo, f.user.photo || Photo.new] do |p|
      if  f.user.photo.nil?
        p.input :image, as: :file
      else
        p.input :image, as: :file, hint: image_tag(f.user.photo.image.url, :size => "100x100")
      end
    end
    unless user.new_record?
      f.has_many :user_roles do |fp|
        fp.inputs do
          fp.input :organization, as: :select, collection: Organization.all.map{|u| ["#{ Organization.find(u.id)["name"] }", u.id]}
          fp.input :role, as: :select
        end
      end
    end
    f.actions
  end

  filter :username
  filter :first_name
  filter :last_name
  filter :created_at
  filter :updated_at

end