ActiveAdmin.register Info do
  permit_params :id, :content, :name,
                info_translation_ids: [],
                info_translations_attributes: [:id, :locale, :key, :value, :type, :node_id, :page_id, :leaf_id, :media_id]

  json_editor

  index do
    selectable_column
    id_column
    column :name
    actions
  end

  show do
    pp info
    attributes_table do
      row :id
      row :name
    end
    if (info.content)
      panel "Content" do
          table_for JSON.parse(info.content).to_a do
            column 'Text' do |info|
              info[0]
            end
            column 'Value' do |info|
              info[1]
            end
          end
      end
    end
    if info.info_translations
      panel "Translates" do
        table_for info.info_translations do
          column 'Locale' do |translate|
            translate.locale
          end
          column 'Key' do |translate|
            translate.key
          end
          column 'Value' do |translate|
            if (translate.key == 'content')
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
            else translate.value
            end
          end
        end
      end
    end
  end

  form do |f|
    f.semantic_errors
    f.inputs 'Name' do
      f.input :name
    end
    f.inputs 'Content' do
      f.input :content, as: :text #, as: :json
    end
    unless info.new_record?
      f.has_many :info_translations do |fp|
        fp.inputs do
          fp.input :locale, label: 'Locale', as: :select
          fp.input :key, as: :select, collection: { "content"=> "content"}
          fp.input :value, as: :text
        end
      end
    end

    f.actions
  end

  filter :name
  filter :created_at
  filter :updated_at

end