ActiveAdmin.register NodeLicence do

  actions :all

  permit_params :id, :activation_code, :start_date, :end_date, :status,
                :owner_id, :owner, :user_id, :user, :node_id, :level, :charge_id, :media_id,
                owner_attributes: [:id, :username],
                user_attributes: [:id, :username],
                level_attributes: [:id, :name]

  show do
    attributes_table do
      row 'Instrument' do |node_licence|
        if node_licence.level
          if node_licence.level.instrument
            node_licence.level.instrument.name
          end
        end
      end
      row 'Level' do |node_licence|
        if node_licence.level
          node_licence.level.name unless node_licence.level.nil?
        end
      end
      row :owner_id do |node_licence|
        node_licence.owner.email_address unless node_licence.owner.nil?
      end
      row :user_id do |node_licence|
        node_licence.user.email_address unless node_licence.user.nil?
      end
      tag_row :status
      row :activation_code
      row :start_date
      row :end_date
      row :created_at
      row :updated_at
    end
  end

  index do
    selectable_column
    column :user_id do |node_licence|
      if (node_licence.user)
        node_licence.user.email_address unless node_licence.user.email_address.nil?
      end
    end
    column 'Instrument' do |node_licence|
      if node_licence.level
        if node_licence.level.instrument
          node_licence.level.instrument.name
        end
      end
    end
    column 'Level' do |node_licence|
      if node_licence.level
        node_licence.level.name
      end
    end
    column :user_id do |node_licence|
      if node_licence.user
        node_licence.user.email_address
      end
    end
    column :start_date
    column :end_date
    tag_column :status
    actions
  end

  form do |f|
    f.semantic_errors
    f.inputs 'Licence' do
      if f.node_licence.new_record?
        f.input :node_id, :label => 'Level/Instrument', :as => :select, :collection => Level.all.map{|u| ["#{ Instrument.find(u.node_id)["name"] + ' ' + u.name }", u.id]}
      else
        f.input :user_id, :label => 'User', :as => :select, :collection => User.all.map{|u| ["#{u.email_address}", u.id]}
        f.input :node_id, :label => 'Level/Instrument', :as => :select, :collection => Level.all.map{|u| ["#{ Instrument.find(u.node_id)["name"] + ' ' + u.name }", u.id]}
        f.input :status
      end


    end
    f.actions
  end

  filter :created_at
  filter :updated_at

end