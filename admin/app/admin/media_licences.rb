ActiveAdmin.register MediaLicence do

  actions :all

  permit_params :id, :activation_code, :start_date, :end_date, :status,
                :owner_id, :owner, :user_id, :user, :node_id, :level, :charge_id, :media_id, :media,
                owner_attributes: [:id, :username],
                user_attributes: [:id, :username],
                level_attributes: [:id, :name]

  show do
    attributes_table do
      row 'Media' do |media_licence|
        if media_licence.media
          media_licence.media.name unless media_licence.media.name.nil?
        end
      end

      row :user_id do |media_licence|
        media_licence.user.email_address unless media_licence.user.nil?
      end
      tag_row :status
      row :created_at
      row :updated_at
    end
  end

  index do
    selectable_column
    column :user_id do |media_licence|
      if (media_licence.user)
        media_licence.user.email_address unless media_licence.user.email_address.nil?
      end
    end
    column 'Media' do |media_licence|

      if media_licence.media
        media_licence.media.name unless media_licence.media.name.nil?
      end
    end
    tag_column :status
    actions
  end

  form do |f|
    f.semantic_errors
    f.inputs 'Licence' do
      if f.media_licence.new_record?
        f.input :user_id, :label => 'User', :as => :select, :collection => User.all.map{|u| ["#{u.email_address}", u.id]}
        f.input :media_id, :label => 'Media', :as => :select, :collection => Media.all.map {|u| ["#{u.name}", u.id]}
      else
        f.input :user_id, :label => 'User', :as => :select, :collection => User.all.map{|u| ["#{u.email_address}", u.id]} if f.media_licence.user_id.nil?
      end
      f.input :status
    end
    f.actions
  end

  filter :created_at
  filter :updated_at

end