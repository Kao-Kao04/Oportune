
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "public": {
          Tables: {
            "analytics_events": {
                  Row: {
                    "anonymous_id": string | null,"created_at": string,"event": string,"id": string,"opportunity_id": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "anonymous_id"?: string | null,"created_at"?: string,"event": string,"id"?: string,"opportunity_id"?: string | null
                  }
                  Update: {
                    "anonymous_id"?: string | null,"created_at"?: string,"event"?: string,"id"?: string,"opportunity_id"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "analytics_events_opportunity_id_fkey"
      columns: ["opportunity_id"]
isOneToOne: false
      referencedRelation: "opportunities"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "analytics_events_opportunity_id_fkey"
      columns: ["opportunity_id"]
isOneToOne: false
      referencedRelation: "public_opportunities"
      referencedColumns: ["id"]
    }
                  ]
                },"audit_logs": {
                  Row: {
                    "action": string,"actor_id": string | null,"created_at": string,"id": string,"metadata": NonNullable<Json>,"target_id": string | null,"target_type": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "action": string,"actor_id"?: string | null,"created_at"?: string,"id"?: string,"metadata"?: NonNullable<Json>,"target_id"?: string | null,"target_type"?: string | null
                  }
                  Update: {
                    "action"?: string,"actor_id"?: string | null,"created_at"?: string,"id"?: string,"metadata"?: NonNullable<Json>,"target_id"?: string | null,"target_type"?: string | null
                  }
                  Relationships: [
                    
                  ]
                },"categories": {
                  Row: {
                    "created_at": string,"id": string,"name": string,"slug": string,"sort_order": number,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"id"?: string,"name": string,"slug": string,"sort_order"?: number,"updated_at"?: string
                  }
                  Update: {
                    "created_at"?: string,"id"?: string,"name"?: string,"slug"?: string,"sort_order"?: number,"updated_at"?: string
                  }
                  Relationships: [
                    
                  ]
                },"job_runs": {
                  Row: {
                    "error": string | null,"failed_count": number,"finished_at": string | null,"id": string,"job": string,"run_for_date": string,"sent_count": number,"started_at": string,"status": string
                  }
                  ComputedFields: never
                  Insert: {
                    "error"?: string | null,"failed_count"?: number,"finished_at"?: string | null,"id"?: string,"job": string,"run_for_date": string,"sent_count"?: number,"started_at"?: string,"status"?: string
                  }
                  Update: {
                    "error"?: string | null,"failed_count"?: number,"finished_at"?: string | null,"id"?: string,"job"?: string,"run_for_date"?: string,"sent_count"?: number,"started_at"?: string,"status"?: string
                  }
                  Relationships: [
                    
                  ]
                },"notifications": {
                  Row: {
                    "channel": string,"created_at": string,"deadline_on": string,"deduplication_key": string,"delivery_status": string,"id": string,"opportunity_id": string,"sent_at": string | null,"type": string,"updated_at": string,"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "channel": string,"created_at"?: string,"deadline_on": string,"deduplication_key": string,"delivery_status"?: string,"id"?: string,"opportunity_id": string,"sent_at"?: string | null,"type": string,"updated_at"?: string,"user_id": string
                  }
                  Update: {
                    "channel"?: string,"created_at"?: string,"deadline_on"?: string,"deduplication_key"?: string,"delivery_status"?: string,"id"?: string,"opportunity_id"?: string,"sent_at"?: string | null,"type"?: string,"updated_at"?: string,"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "notifications_opportunity_id_fkey"
      columns: ["opportunity_id"]
isOneToOne: false
      referencedRelation: "opportunities"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "notifications_opportunity_id_fkey"
      columns: ["opportunity_id"]
isOneToOne: false
      referencedRelation: "public_opportunities"
      referencedColumns: ["id"]
    }
                  ]
                },"opportunities": {
                  Row: {
                    "application_opens": string | null,"application_opens_type": string,"application_url": string | null,"category_id": string,"confidence": string | null,"created_at": string,"created_by": string | null,"deadline": string | null,"deadline_type": string,"delivery_mode": string | null,"eligibility": string | null,"external_id": string | null,"id": string,"last_checked_at": string | null,"location": string | null,"needs_check": boolean,"notes": string | null,"organization": string,"recheck_due": boolean,"requirements": string | null,"reviewed_by": string | null,"search_vector": unknown,"slug": string,"source_trust": string,"source_url": string,"status": string,"summary": string | null,"title": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "application_opens"?: string | null,"application_opens_type"?: string,"application_url"?: string | null,"category_id": string,"confidence"?: string | null,"created_at"?: string,"created_by"?: string | null,"deadline"?: string | null,"deadline_type"?: string,"delivery_mode"?: string | null,"eligibility"?: string | null,"external_id"?: string | null,"id"?: string,"last_checked_at"?: string | null,"location"?: string | null,"needs_check"?: boolean,"notes"?: string | null,"organization": string,"recheck_due"?: boolean,"requirements"?: string | null,"reviewed_by"?: string | null,"search_vector"?: never,"slug": string,"source_trust"?: string,"source_url": string,"status"?: string,"summary"?: string | null,"title": string,"updated_at"?: string
                  }
                  Update: {
                    "application_opens"?: string | null,"application_opens_type"?: string,"application_url"?: string | null,"category_id"?: string,"confidence"?: string | null,"created_at"?: string,"created_by"?: string | null,"deadline"?: string | null,"deadline_type"?: string,"delivery_mode"?: string | null,"eligibility"?: string | null,"external_id"?: string | null,"id"?: string,"last_checked_at"?: string | null,"location"?: string | null,"needs_check"?: boolean,"notes"?: string | null,"organization"?: string,"recheck_due"?: boolean,"requirements"?: string | null,"reviewed_by"?: string | null,"search_vector"?: never,"slug"?: string,"source_trust"?: string,"source_url"?: string,"status"?: string,"summary"?: string | null,"title"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "opportunities_category_id_fkey"
      columns: ["category_id"]
isOneToOne: false
      referencedRelation: "categories"
      referencedColumns: ["id"]
    }
                  ]
                },"opportunity_reports": {
                  Row: {
                    "created_at": string,"details": string | null,"id": string,"opportunity_id": string,"reason": string,"status": string,"updated_at": string,"user_id": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"details"?: string | null,"id"?: string,"opportunity_id": string,"reason": string,"status"?: string,"updated_at"?: string,"user_id"?: string | null
                  }
                  Update: {
                    "created_at"?: string,"details"?: string | null,"id"?: string,"opportunity_id"?: string,"reason"?: string,"status"?: string,"updated_at"?: string,"user_id"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "opportunity_reports_opportunity_id_fkey"
      columns: ["opportunity_id"]
isOneToOne: false
      referencedRelation: "opportunities"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "opportunity_reports_opportunity_id_fkey"
      columns: ["opportunity_id"]
isOneToOne: false
      referencedRelation: "public_opportunities"
      referencedColumns: ["id"]
    }
                  ]
                },"opportunity_slug_redirects": {
                  Row: {
                    "created_at": string,"old_slug": string,"opportunity_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"old_slug": string,"opportunity_id": string
                  }
                  Update: {
                    "created_at"?: string,"old_slug"?: string,"opportunity_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "opportunity_slug_redirects_opportunity_id_fkey"
      columns: ["opportunity_id"]
isOneToOne: false
      referencedRelation: "opportunities"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "opportunity_slug_redirects_opportunity_id_fkey"
      columns: ["opportunity_id"]
isOneToOne: false
      referencedRelation: "public_opportunities"
      referencedColumns: ["id"]
    }
                  ]
                },"profiles": {
                  Row: {
                    "course": string | null,"course_group": string | null,"created_at": string,"display_name": string | null,"email_reminders_enabled": boolean,"email_unsubscribe_token": string,"interests": (string)[],"is_18_or_over": boolean | null,"push_reminders_enabled": boolean,"school": string | null,"updated_at": string,"user_id": string,"year_level": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "course"?: string | null,"course_group"?: string | null,"created_at"?: string,"display_name"?: string | null,"email_reminders_enabled"?: boolean,"email_unsubscribe_token"?: string,"interests"?: (string)[],"is_18_or_over"?: boolean | null,"push_reminders_enabled"?: boolean,"school"?: string | null,"updated_at"?: string,"user_id": string,"year_level"?: string | null
                  }
                  Update: {
                    "course"?: string | null,"course_group"?: string | null,"created_at"?: string,"display_name"?: string | null,"email_reminders_enabled"?: boolean,"email_unsubscribe_token"?: string,"interests"?: (string)[],"is_18_or_over"?: boolean | null,"push_reminders_enabled"?: boolean,"school"?: string | null,"updated_at"?: string,"user_id"?: string,"year_level"?: string | null
                  }
                  Relationships: [
                    
                  ]
                },"push_subscriptions": {
                  Row: {
                    "auth": string,"created_at": string,"endpoint": string,"id": string,"p256dh": string,"updated_at": string,"user_agent": string | null,"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "auth": string,"created_at"?: string,"endpoint": string,"id"?: string,"p256dh": string,"updated_at"?: string,"user_agent"?: string | null,"user_id": string
                  }
                  Update: {
                    "auth"?: string,"created_at"?: string,"endpoint"?: string,"id"?: string,"p256dh"?: string,"updated_at"?: string,"user_agent"?: string | null,"user_id"?: string
                  }
                  Relationships: [
                    
                  ]
                },"rate_limits": {
                  Row: {
                    "count": number,"key": string,"window_start": string
                  }
                  ComputedFields: never
                  Insert: {
                    "count"?: number,"key": string,"window_start": string
                  }
                  Update: {
                    "count"?: number,"key"?: string,"window_start"?: string
                  }
                  Relationships: [
                    
                  ]
                },"saved_opportunities": {
                  Row: {
                    "created_at": string,"id": string,"opportunity_id": string,"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"id"?: string,"opportunity_id": string,"user_id": string
                  }
                  Update: {
                    "created_at"?: string,"id"?: string,"opportunity_id"?: string,"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "saved_opportunities_opportunity_id_fkey"
      columns: ["opportunity_id"]
isOneToOne: false
      referencedRelation: "opportunities"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "saved_opportunities_opportunity_id_fkey"
      columns: ["opportunity_id"]
isOneToOne: false
      referencedRelation: "public_opportunities"
      referencedColumns: ["id"]
    }
                  ]
                },"user_roles": {
                  Row: {
                    "created_at": string,"granted_by": string | null,"role": string,"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"granted_by"?: string | null,"role": string,"user_id": string
                  }
                  Update: {
                    "created_at"?: string,"granted_by"?: string | null,"role"?: string,"user_id"?: string
                  }
                  Relationships: [
                    
                  ]
                }
          }
          Views: {
            "public_opportunities": {
                  Row: {
                    "application_opens": string | null,"application_opens_type": string | null,"application_url": string | null,"category_id": string | null,"category_name": string | null,"category_slug": string | null,"deadline": string | null,"deadline_type": string | null,"delivery_mode": string | null,"eligibility": string | null,"id": string | null,"last_checked_at": string | null,"location": string | null,"organization": string | null,"requirements": string | null,"search_vector": unknown,"slug": string | null,"source_trust": string | null,"source_url": string | null,"status": string | null,"summary": string | null,"title": string | null,"updated_at": string | null
                  }
                  ComputedFields: never
                  Relationships: [
                    {
      foreignKeyName: "opportunities_category_id_fkey"
      columns: ["category_id"]
isOneToOne: false
      referencedRelation: "categories"
      referencedColumns: ["id"]
    }
                  ]
                }
          }
          Functions: {
            "hit_rate_limit":
{ Args: { "limit_key": string,"max_hits": number,"window_seconds": number }; Returns: boolean
                           },
"is_admin":
{ Args: Record<PropertyKey, never>; Returns: boolean
                           },
"is_curator":
{ Args: Record<PropertyKey, never>; Returns: boolean
                           },
"is_published_opportunity":
{ Args: { "opportunity": string }; Returns: boolean
                           },
"search_opportunities":
{ Args: { "q": string }; Returns: {
              "application_opens": string | null,
"application_opens_type": string | null,
"application_url": string | null,
"category_id": string | null,
"category_name": string | null,
"category_slug": string | null,
"deadline": string | null,
"deadline_type": string | null,
"delivery_mode": string | null,
"eligibility": string | null,
"id": string | null,
"last_checked_at": string | null,
"location": string | null,
"organization": string | null,
"requirements": string | null,
"search_vector": unknown,
"slug": string | null,
"source_trust": string | null,
"source_url": string | null,
"status": string | null,
"summary": string | null,
"title": string | null,
"updated_at": string | null
            }[]
                          SetofOptions: {
        from: "*"
        to: "public_opportunities"
        isOneToOne: false
        isSetofReturn: true
      } }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "public": {
          Enums: {
            
          }
        }
} as const
