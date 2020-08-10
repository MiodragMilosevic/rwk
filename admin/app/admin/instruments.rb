ActiveAdmin.register Instrument do

  permit_params :id, :name, :content, :photo, :photo_id, :position, photo_attributes: [:id, :image],
                instrument_translation_ids: [],
                instrument_translations_attributes: [:id, :locale, :key, :value, :type, :node_id, :page_id, :leaf_id, :media_id]

  json_editor

  show do
    attributes_table do
      row :name
      row :photo do |instrument|
        image_tag(instrument.photo.image.url, :size => "100x100") unless instrument.photo.nil?
      end
      row :position
      row :created_at
      row :updated_at
    end

    if (instrument.content['description'])
      panel "Description" do
        if instrument.content['description']
          table_for JSON.parse(instrument.content)['description'] do
            column 'Description' do |instrument|
              instrument['text']
            end
          end
        end
      end
    end
    if instrument.content['criteria_list']
    panel "Criteria" do
        if instrument.content['criteria_list']
          table_for JSON.parse(instrument.content)['criteria_list'] do
            column 'Criteria' do |instrument|
              instrument['criteria']
            end
          end
        end
      end
    end
    if (!instrument.content['criteria_list']  && !instrument.content['description'])
      panel "Content" do
        table_for JSON.parse(instrument.content).to_a do
          column 'Text' do |info|
            info[0]
          end
          column 'Value' do |info|
            info[1]
          end
        end
      end
    end
    if instrument.levels
      panel "Levels" do
        table_for instrument.levels do
          column 'Level' do |level|
            link_to "#{level.name}", admin_level_path(level)
          end
        end
      end
    end

    if instrument.instrument_translations
      panel "Translates" do
        table_for instrument.instrument_translations do
          column 'Locale' do |translate|
            translate.locale
          end
          column 'Key' do |translate|
            translate.key
          end
          column 'Value' do |translate|
            if (translate.key == 'content')
              if (translate.value['description'])
                panel "Description" do
                  if translate.value['description']
                    table_for JSON.parse(translate.value)['description'] do
                      column 'Description' do |instrument|
                        instrument['text']
                      end
                    end
                  end
                end
              end

              if translate.value['criteria_list']
                panel "Criteria" do
                  if translate.value['criteria_list']
                    table_for JSON.parse(translate.value)['criteria_list'] do
                      column 'Criteria' do |instrument|
                        instrument['criteria']
                      end
                    end
                  end
                end
              end

              if (!translate.value['criteria_list']  && !translate.value['description'])
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

  index do
    selectable_column
    column 'Instrument' do |instrument|
      link_to "#{instrument.name}", admin_instrument_path(instrument)
    end
    column :photo do |instrument|
      image_tag(instrument.photo.image.url, :size => "100x100") unless instrument.photo.nil?
    end
    actions
  end

  form do |f|
    f.semantic_errors
    f.inputs 'Instrument' do
      f.input :name
      f.input :content, as: :text #, as: :json
      f.input :position
    end

    f.inputs 'Photo', for: [:photo, f.instrument.photo || Photo.new] do |p|
      if  f.instrument.photo.nil?
        p.input :image, as: :file
      else
        p.input :image, as: :file, hint: image_tag(f.instrument.photo.image.url, :size => "100x100")
      end
    end
    unless instrument.new_record?
      f.has_many :instrument_translations do |fp|
        fp.inputs do
          fp.input :locale, label: 'Locale', as: :select
          fp.input :key, as: :select, collection: { "name"=> "name", "content"=>"content"}
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
