
#require 'combine_pdf'

class Leaf < ApplicationRecord

  include MultiLanguage

  establish_connection SEC_DATABASE
  mount_uploader :pdf, DocumentUploader
  mount_uploader :pdf_preview, DocumentUploader

  belongs_to :category, foreign_key: :node_id, class_name: 'Category'

  scope :filter_by_category, ->(category_id) { where(node_id: category_id) }

  has_many :leaf_translations, foreign_key: 'leaf_id', class_name: 'LeafTranslation', dependent: :destroy
  accepts_nested_attributes_for :leaf_translations, allow_destroy: true
  acts_as_list scope: :node

  translates :name, :content

  after_create :create_preview

  def parsed_content
    if content.present?
      JSON.parse(content.to_json)
    else
      {}
    end
  end

  def create_preview
    watermark = CombinePDF.load(Rails.root.join('public/assets/Watermark.pdf')).pages[0]

    pdf_preview = CombinePDF.parse Net::HTTP.get_response(URI.parse(URI.encode(self.pdf.url))).body if self.pdf.url.present?
    pp pdf_preview
    if pdf_preview.present?
      first_page = pdf_preview.pages[0] if pdf_preview.pages[0].present?
      second_page = pdf_preview.pages[1] if pdf_preview.pages[1].present?
      third_page = pdf_preview.pages[2] if pdf_preview.pages[2].present?
      pdf_new = CombinePDF.new
      if pdf_new.present?
        pdf_new << first_page if first_page.present?
        pdf_new << second_page if second_page.present?
        pdf_new << third_page if third_page.present?
        pdf_new.pages.each {|page| page << watermark}
        pdf_new.save "preview.pdf"
        file = File.new("preview.pdf")
        self.update!(pdf_preview: file)
        File.delete("preview.pdf") if File.exists?("preview.pdf")
      end
    end
  end
end
