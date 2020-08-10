ActiveAdmin.register UserRole do

  permit_params :id, :role, :user, :role_id, :user_id, :organization, :organization_id

  show do
    attributes_table do
      row :role
      row :user do |user_role|
        user_role.user.email_address unless user_role.user.email_address.nil?
      end
      row :organization do |user_role|
        if user_role.organization
          user_role.organization.name unless user_role.organization.name.nil?
        end
      end
      row :created_at
      row :updated_at
    end
  end

  index do

    selectable_column
    column :user do |user_role|
      if (user_role.user)
        user_role.user.email_address unless user_role.user.email_address.nil?
      end
    end
    column :organization do |user_role|
      if (user_role.organization)
        user_role.organization.name unless user_role.organization.name.nil?
      end
    end
    column :role
    actions
  end

  form  do |f|

    f.inputs 'UserRole' do
      if user_role.new_record?
        f.input :user, as: :select, collection: User.all.map{|u| ["#{ User.find(u.id)["email_address"] }", u.id]}
      end
      f.input :organization, as: :select, collection: Organization.all.map{|u| ["#{ Organization.find(u.id)["name"] }", u.id]}
      f.input :role, as: :select
    end
    f.actions
  end

  filter :user, as: :select, collection: User.all.map{|u| ["#{ User.find(u.id)["email_address"] }", u.id]}
  filter :organization, as: :select, collection: Organization.all.map{|u| ["#{ Organization.find(u.id)["name"] }", u.id]}
  filter :created_at
  filter :updated_at

end