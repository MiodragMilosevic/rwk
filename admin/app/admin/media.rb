ActiveAdmin.register Media do

  permit_params :id, :name, :author, :content, :place, :price, :position, :jwplayer_media_id, :jwplayer_media_id, :duration,
                media_translation_ids: [],
                media_translations_attributes: [:id, :locale, :key, :value, :type, :node_id, :page_id, :leaf_id, :media_id]

    controller do
      def create
        if params[:media][:file] && params[:media][:name] && params[:media][:price]
          media = Media.create(name: params[:media][:name], author: params[:media][:author], price: params[:media][:price], duration: params[:media][:duration], place: params[:media][:place], content: params[:media][:content])
          media_id_original = JWPlayer::MediaUpload.create_and_upload(params[:media][:name], nil, params[:media][:file])
          media_id_trim = JWPlayer::MediaUpload.create_and_upload(params[:media][:name], '00:00:10.000', params[:media][:file])
          media.update!(jwplayer_media_id: media_id_original, jwplayer_media_preview_id: media_id_trim)
          redirect_to admin_media_path(media.id)
        else
          redirect_to new_admin_media_path
        end
      end
    end

    show do
    attributes_table do
      row :name
      row :author
      row :content
      row :place
      number_row :price, as: :currency, unit: "$", separator: ","
      row :position
      row :jwplayer_media_preview_id do |media|
        link_to('Media_Preview', media.video(media.jwplayer_media_preview_id)) unless media.jwplayer_media_preview_id.nil?
      end
      row :jwplayer_media_id do |media|
        link_to('Media_Original', media.video(media.jwplayer_media_id)) unless media.jwplayer_media_id.nil?
      end
      row 'Photo' do
        if media.photo(media.jwplayer_media_preview_id)
          image_tag(media.photo(media.jwplayer_media_preview_id), :size => "100x100") unless media.jwplayer_media_preview_id.nil?
        end
      end

      if media.media_translations
        panel "Translates" do
          table_for media.media_translations do
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

      row :created_at
      row :updated_at
    end
  end

  index do
    selectable_column
    column :name
    column :author
    column :content
    column :place
    number_column :price, as: :currency, unit: "$", separator: ","
    column :position
    actions
  end

  form  do |f|
    f.semantic_errors
    f.inputs 'Media' do
      f.input :name
      f.input :author
      f.input :content
      f.input :place
      f.input :price
      f.input :position
      f.input :duration
      if  f.media.jwplayer_media_id.nil?
        f.input :file, as: :file
      else
        f.input :file, as: :file, hint: image_tag(f.media.photo(f.media.jwplayer_media_preview_id), :size => "100x100") unless f.media.jwplayer_media_preview_id.nil?
      end
    end
    unless media.new_record?
      f.has_many :media_translations do |fp|
        fp.inputs do
          fp.input :locale, :label => 'Locale', :as => :select
          fp.input :key, as: :select, collection: { "name"=> "name", "author"=> "author", "content"=> "content", "place"=> "place"}
          fp.input :value, as: :text
        end
      end
    end
    f.actions
  end

  filter :name
  filter :author
  filter :content
  filter :price
  filter :created_at
  filter :updated_at
end