json.id leaf.id
json.pdf_preview leaf.pdf_preview
json.position leaf.position
json.name leaf.name
json.updated_at leaf.updated_at
json.content leaf.parsed_content
if current_user.present? && current_user.accessible?(leaf)
 json.pdf leaf.pdf
end
