ActiveAdmin.register Category do

  permit_params :id, :name, :node, :node_id, :position,
                leaves_ids: [],
                leaves_attributes: [:id ],
                category_translation_ids: [],
                category_translations_attributes: [:id, :locale, :key, :value, :type, :node_id, :page_id, :leaf_id, :media_id]

  index do
    selectable_column
    column "Instrument" do |node|
      link_to "#{Node.find(Node.find(node.node_id).node_id).name}", admin_instrument_path(Node.find(Node.find(node.node_id).node_id))
    end
    column "Level" do |node|
      link_to "#{Node.find(node.node_id).name}", admin_level_path(Node.find(node.node_id))
    end
    column "Category" do |node|
      link_to "#{node.name}", admin_category_path(node)
    end
    actions
  end

  show  do
    attributes_table  do
      row :name
      row :position
      row :created_at
      row :updated_at
    end
    if category.leaves && category.leaves != []
      panel "Leaves" do
        table_for category.leaves do
          column 'name' do |leaf|
            link_to "#{leaf.name}",  admin_leaf_path(leaf)
          end
        end
      end
    end
    if category.category_translations
      panel "Translates" do
        table_for category.category_translations do
          column 'Locale' do |translate|
            translate.locale
          end
          column 'Key' do |translate|
            translate.key
          end
          column 'Value' do |translate|
            translate.value
          end
        end
      end
    end
  end

  form  do |f|
    f.semantic_errors
    f.inputs 'Category' do
      f.input :name
      f.input :node_id, :label => 'Level/Instrument', :as => :select, :collection => Level.all.map{|u| ["#{ Instrument.find(u.node_id)["name"] + ' ' + u.name }", u.id]}
      f.input :position
    end
    unless category.new_record?
      f.has_many :category_translations do |fp|
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