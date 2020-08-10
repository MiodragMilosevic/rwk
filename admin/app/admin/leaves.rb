ActiveAdmin.register Leaf do

  actions :all, :except => []

  permit_params :id, :pdf, :pdf_preview, :content, :node, :node_id, :name, :position,
                leaf_translation_ids: [],
                leaf_translations_attributes: [:id, :locale, :key, :value, :type, :node_id, :page_id, :leaf_id, :media_id]

  index do
    selectable_column
    column :name
    column "Instrument" do |node|
      if (node.node_id && Node.find(node.node_id) && Node.find(Node.find(node.node_id).id))
        link_to "#{Node.find(Node.find(Node.find(node.node_id).node_id).node_id).name}", admin_instrument_path(Node.find(Node.find(Node.find(node.node_id).node_id).node_id))
      end
    end
    column "Level" do |node|
      if (node.node_id && Node.find(node.node_id).id)
        link_to "#{Node.find(Node.find(node.node_id).node_id).name}", admin_level_path(Node.find(Node.find(node.node_id).node_id))
      end

    end
    column "Category" do |node|
      if (node.node_id)
        link_to "#{Node.find(node.node_id).name}", admin_category_path(Node.find(node.node_id))
      end
    end
    column :pdf do |document|
      link_to('Pdf',  document.pdf.url) unless document.pdf.nil?
    end
    column :pdf_preview do |document|
      link_to('Pdf preview',  document.pdf_preview.url) unless document.pdf_preview.nil?
    end
    actions
  end

  show do
    attributes_table do
      row :name
      row :category

      row :pdf do |document|
        link_to('Pdf',  document.pdf.url) unless document.pdf.nil?
      end
      row :pdf_preview do |document|
        link_to('Pdf preview',  document.pdf_preview.url) unless document.pdf_preview.nil?
      end
      row :position
      row :created_at
      row :updated_at
    end
    if (leaf.content)
      panel "Content" do
        table_for JSON.parse(leaf.content) do
          column 'title' do |category|
            category["title"]
          end
          column 'artist' do |category|
            category["artist"]
          end
          column 'duration' do |category|
            category["duration"]
          end
          column 'description' do |category|
            category["description"]
          end
        end
      end
    end
    if leaf.leaf_translations
      panel "Translates" do
        table_for leaf.leaf_translations do
          column 'Locale' do |translate|
            translate.locale
          end
          column 'Key' do |translate|
            translate.key
          end
          column 'Value' do |translate|
            if (translate.key == 'content')
              panel "Description" do
                table_for JSON.parse(translate.value) do
                  column 'title' do |tr|
                    tr['title']
                  end
                  column 'artist' do |tr|
                    tr['artist']
                  end
                  column 'duration' do |tr|
                    tr['duration']
                  end
                  column 'description' do |tr|
                    tr['description']
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

  form  do |f|
    f.semantic_errors
    f.inputs 'Leaf' do
      f.input :name
      f.input :pdf, as: :file, hint: f.leaf.pdf.url
      f.input :position
      f.input :node_id, :label => 'Category', :as => :select, :collection =>  Category.all.map{|u| ["#{ Instrument.find(Level.find(u.node_id)["node_id"])["name"] + ' ' + Level.find(u.node_id)["name"] + ' ' + u.name }", u.id]}
    end
    unless leaf.new_record?
      f.has_many :leaf_translations do |fp|
        fp.inputs do
          fp.input :locale, :label => 'Locale', :as => :select
          fp.input :key, as: :select, collection: { "name"=> "name"}
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