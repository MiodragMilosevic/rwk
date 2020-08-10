ActiveAdmin.register Level do

  permit_params :id, :name, :photo, :photo_id, :node, :node_id, :content, :price, :position, photo_attributes: [:id, :image], node_ids: [], nodes_attribute: [:name],
                level_translation_ids: [],
                level_translations_attributes: [:id, :locale, :key, :value, :type, :node_id, :page_id, :leaf_id, :media_id]

  json_editor

  index do
    selectable_column
    column "Instrument" do |node|
      link_to "#{Node.find(node.node_id).name}", admin_instrument_path(Node.find(node.node_id).id)
    end
    column "Level" do |level|
      link_to "#{level.name}", admin_level_path(level)
    end
    actions
  end

  show do
    attributes_table do
      row :name
      number_row :price, as: :currency, unit: "$", separator: ","
      row :position
      row :created_at
      row :updated_at
    end
    if (level.content)
      panel "Overview list" do
        if JSON.parse(level.content)['overview_list']
          table_for level.content['overview_list'] do
            column 'Overview' do |level|
              level['overview']
            end
          end
        end
      end

      if (!level.content['overview_list'])
        panel "Content" do
          table_for JSON.parse(level.content).to_a do
            column 'Text' do |info|
              info[0]
            end
            column 'Value' do |info|
              info[1]
            end
          end
        end
      end
    end
    if level.categories && level.categories != []
      panel "Categories" do
        table_for level.categories do
         column 'name' do |category|
            link_to "#{category.name}", admin_category_path(category)
          end
        end
      end
    end

    if level.level_translations
      panel "Translates" do
        table_for level.level_translations do
          column 'Locale' do |translate|
            translate.locale
          end
          column 'Key' do |translate|
            translate.key
          end
          column 'Value' do |translate|
            if (translate.key == 'content')
              if (translate.value['overview_list'])
                panel "Overview" do
                  if translate.value['overview_list']
                    table_for JSON.parse(translate.value)['overview_list'] do
                      column 'Overview' do |instrument|
                        instrument['overview']
                      end
                    end
                  end
                end
              end
              if (!translate.value['overview_list'] )
                panel "Content" do
                  table_for JSON.parse(translate.value).to_a do
                    column 'Text' do |info|
                      info[0]
                    end
                    column 'Value' do |info|
                      info[1]
                    end
                  end
                end
              end
            else translate.value
            end
          end
        end
      end
    end

  end

  form do |f|
    f.semantic_errors
    f.inputs 'Level' do
      f.input :name
      f.input :content, as: :text#, as: :json
      f.input :node_id, :label => 'Instrument', :as => :select, :collection => Instrument.all.map{|u| ["#{u.name}", u.id]}
      f.input :price
      f.input :position
      unless level.new_record?
        f.has_many :level_translations do |fp|
          fp.inputs do
            fp.input :locale, :label => 'Locale', :as => :select, :collection =>  { "en"=> "en", "es"=>"es", "ya"=>"ya"}
            fp.input :key, as: :select, collection: { "name"=> "name", "content"=>"content"}
            fp.input :value, as: :text
          end
        end
      end
    end
    f.actions
  end

  filter :node_id, as: :select, collection: -> {  Instrument.all }
  filter :name
  filter :created_at
  filter :updated_at
end